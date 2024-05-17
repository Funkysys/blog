const PageTitle = ({title} : {title: string}) => {
  return (
    <h1 className="text-4xl font-bold text-center mb-10 mt-3">{title.substring(0,1).toUpperCase()}{title.replace("-", " ").replace("%20", " ").substring(1)}</h1>
  )
}

export default PageTitle