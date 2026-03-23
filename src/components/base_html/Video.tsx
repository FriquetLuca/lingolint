import { urlPrefix } from '../../urlPrefix';

export default function Video({
  src,
  ...props
}: React.DetailedHTMLProps<
  React.VideoHTMLAttributes<HTMLVideoElement>,
  HTMLVideoElement
>) {
  return <video {...props} src={src ? urlPrefix(src) : src} />;
}
