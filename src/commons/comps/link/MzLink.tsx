interface Props {
  href: string
  title: string
}

export function MzLink({ href, title }: Props) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {title}
    </a>
  )
}
