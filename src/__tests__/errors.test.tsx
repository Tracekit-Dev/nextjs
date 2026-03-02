import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';

vi.mock('@tracekit/browser', () => ({
  captureException: vi.fn().mockReturnValue('event-id-123'),
}));

import { captureException } from '@tracekit/browser';
import { GlobalError, withTraceKitErrorPage } from '../errors';

describe('GlobalError', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('calls captureException on mount with error and mechanism nextjs.globalError', () => {
    const error = new Error('Test error');
    const reset = vi.fn();

    render(<GlobalError error={error} reset={reset} />);

    expect(captureException).toHaveBeenCalledWith(error, {
      mechanism: 'nextjs.globalError',
      digest: undefined,
    });
  });

  it('renders reset button that calls reset prop', () => {
    const error = new Error('Test error');
    const reset = vi.fn();

    const { container } = render(<GlobalError error={error} reset={reset} />);

    const button = container.querySelector('button');
    expect(button).not.toBeNull();
    expect(button!.textContent).toBe('Try again');
    fireEvent.click(button!);

    expect(reset).toHaveBeenCalledOnce();
  });

  it('includes error.digest in captureException context', () => {
    const error = Object.assign(new Error('Digest error'), {
      digest: 'abc123',
    });
    const reset = vi.fn();

    render(<GlobalError error={error} reset={reset} />);

    expect(captureException).toHaveBeenCalledWith(error, {
      mechanism: 'nextjs.globalError',
      digest: 'abc123',
    });
  });

  it('renders Something went wrong heading', () => {
    const error = new Error('Test');
    const reset = vi.fn();

    const { container } = render(<GlobalError error={error} reset={reset} />);

    const heading = container.querySelector('h2');
    expect(heading).not.toBeNull();
    expect(heading!.textContent).toBe('Something went wrong!');
  });
});

describe('withTraceKitErrorPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('calls captureException when err prop provided', () => {
    const MockErrorPage = (props: { statusCode?: number }) => (
      <div>Error {props.statusCode}</div>
    );
    const WrappedPage = withTraceKitErrorPage(MockErrorPage);

    const err = new Error('Page error');
    render(<WrappedPage err={err} statusCode={500} />);

    expect(captureException).toHaveBeenCalledWith(err, {
      mechanism: 'nextjs.errorPage',
    });
  });

  it('renders the wrapped component with all props', () => {
    const MockErrorPage = (props: { statusCode?: number; title?: string }) => (
      <div>
        Error {props.statusCode}: {props.title}
      </div>
    );
    const WrappedPage = withTraceKitErrorPage(MockErrorPage);

    const { getByText } = render(
      <WrappedPage statusCode={404} title="Not Found" />,
    );

    expect(getByText('Error 404: Not Found')).toBeTruthy();
  });

  it('does not call captureException when no err prop', () => {
    const MockErrorPage = () => <div>Error Page</div>;
    const WrappedPage = withTraceKitErrorPage(MockErrorPage);

    render(<WrappedPage />);

    expect(captureException).not.toHaveBeenCalled();
  });
});
