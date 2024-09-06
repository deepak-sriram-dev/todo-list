import CircularProgress, {
  CircularProgressProps,
} from "@mui/material/CircularProgress";

interface LoadingPropsInterface {
  className?: string;
  loadingProps?: CircularProgressProps;
}

// interface CircularProgressProps {
//   size?: number;
//   color?: "primary" | "secondary" | "inherit";
//   thickness?: number;
//   variant?: "determinate" | "indeterminate";
//   value?: number;
//   className?: string;
// }

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
