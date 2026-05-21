interface MastheadProps {
  volume: number;
  edition: string;
  todayLabel: string;
}

export function Masthead({ volume, edition, todayLabel }: MastheadProps) {
  return (
    <>
      <header className="masthead fade-in">
        <div className="masthead__chapter">
          <span>Vol. {volume.toString().padStart(2, '0')}</span>
          <strong>Of nine squares</strong>
        </div>
        <h1 className="masthead__title">
          Tic — Tac — <em>Toe</em>
        </h1>
        <div className="masthead__meta">
          <span>{todayLabel}</span>
          <strong>{edition}</strong>
        </div>
      </header>
      <p className="subhead fade-in fade-in--delay-1">
        <span className="subhead__left">
          A small game of marks, set in three columns and three rows
        </span>
        <span className="subhead__pipe">·  ·  ·</span>
        <span className="subhead__right">
          A Spring Boot press, printed onto warm paper in your browser
        </span>
      </p>
    </>
  );
}
