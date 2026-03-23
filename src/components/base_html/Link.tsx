import { urlPrefix } from '../../urlPrefix';

export default function Link({
  href,
  ...props
}: React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>) {
  return <a {...props} href={href ? urlPrefix(href) : href} />;
}
