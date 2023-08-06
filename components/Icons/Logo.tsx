export default function Logo() {
  return (
    <div>
      <img
        aria-labelledby="conf-logo-title-header"
        role="img"
        width="150"
        height="150"
        src="/cat.png"
      />
      <title id="conf-logo-title-header">
        Wordage: guess the AI prompt for the image!
      </title>
    </div>
  );
}
