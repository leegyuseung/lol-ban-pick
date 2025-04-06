interface ButtonProps {
  text: string;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  onClick?: () => void;
}

export default function Button({ text, type = 'button', className = '', onClick }: ButtonProps) {
  return (
    <button className={className} onClick={onClick} type={type}>
      {text}
    </button>
  );
}
