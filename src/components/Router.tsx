import { BrowserRouter, type BrowserRouterProps } from 'react-router';

export default function Router({
  children,
  ...props
}: Omit<BrowserRouterProps, 'basename'>) {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL} {...props}>
      {children}
    </BrowserRouter>
  );
}
