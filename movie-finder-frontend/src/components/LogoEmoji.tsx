import logoUrl from '/movie-finder-logo.svg?url'; 

type LogoEmojiProps = {
  size?: string;
};

const LogoEmoji =  ( {size = '1em'} : LogoEmojiProps) => (
  <img 
    src={logoUrl}
    alt="logo" 
    style={{ 
      width: size, 
      height: size, 
      display: 'inline', 
      verticalAlign: 'middle' 
    }}
  />
);

export default LogoEmoji;