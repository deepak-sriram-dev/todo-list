import CircularProgress, {
  CircularProgressProps,
} from "@mui/material/CircularProgress";

interface LoadingPropsInterface {
  className?: string;
  loadingProps?: CircularProgressProps;
}

export default function Loading({
  className,
  loadingProps,
}: LoadingPropsInterface): JSX.Element {
  return (
    <div className={className}>
      <CircularProgress {...loadingProps} />{" "}
    </div>
  );
}
