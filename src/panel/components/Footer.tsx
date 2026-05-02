interface Props {
  count: number;
}

export function Footer({ count }: Props) {
  return (
    <div id="footer">
      <div id="cookies-count-container">
        Total cookies: <span id="cookies-count">{count}</span>
      </div>
    </div>
  );
}
