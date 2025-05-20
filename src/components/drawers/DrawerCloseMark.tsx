export default function DrawerCloseMark({
  fill = "#ffffff",
  stroke = "#ffffff",
}: {
  fill?: string;
  stroke?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill={fill}
      stroke={stroke}
    >
      <path d="M480-360 280-560h400L480-360Z" />
    </svg>
  );
}
