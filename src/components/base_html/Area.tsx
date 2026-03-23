import { urlPrefix } from '../../urlPrefix';

export default function Area({
  href,
  ...props
}: React.DetailedHTMLProps<
  React.AreaHTMLAttributes<HTMLAreaElement>,
  HTMLAreaElement
>) {
  return <area {...props} href={href ? urlPrefix(href) : href} />;
}
