import { urlPrefix } from '../../urlPrefix';

export default function Source({
  src,
  ...props
}: React.DetailedHTMLProps<
  React.SourceHTMLAttributes<HTMLSourceElement>,
  HTMLSourceElement
>) {
  return <source {...props} src={src ? urlPrefix(src) : src} />;
}
