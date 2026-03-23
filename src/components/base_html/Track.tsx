import { urlPrefix } from '../../urlPrefix';

export default function Track({
  src,
  ...props
}: React.DetailedHTMLProps<
  React.TrackHTMLAttributes<HTMLTrackElement>,
  HTMLTrackElement
>) {
  return <track {...props} src={src ? urlPrefix(src) : src} />;
}
