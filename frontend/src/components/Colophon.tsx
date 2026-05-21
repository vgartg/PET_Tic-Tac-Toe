interface ColophonProps {
  edition: string;
  apiNote: string;
}

export function Colophon({ edition, apiNote }: ColophonProps) {
  return (
    <footer className="colophon">
      <div>Set in Fraunces &amp; DM Mono</div>
      <div className="colophon__center">
        Pressed by hand —{' '}
        <a href="https://github.com/vgartg/PET_Tic-Tac-Toe" target="_blank" rel="noreferrer">
          source on GitHub
        </a>
      </div>
      <div className="colophon__right">
        {edition} · {apiNote}
      </div>
    </footer>
  );
}
