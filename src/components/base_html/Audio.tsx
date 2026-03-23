import { urlPrefix } from '../../urlPrefix';

export default function Audio({
  src,
  ...props
}: React.DetailedHTMLProps<
  React.SourceHTMLAttributes<HTMLAudioElement>,
  HTMLAudioElement
>) {
  return <audio {...props} src={src ? urlPrefix(src) : src} />;
}
