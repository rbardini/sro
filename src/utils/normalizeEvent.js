export default ({ data, descricao, hora, ...restEvent }) => {
  const [day, month, year] = data.split('/')
  const [hour, minute] = hora.split(':')

  return {
    data: `${year}-${month}-${day}T${hour}:${minute}`,
    // The 'descricao' field sometimes contains unclosed tags,
    // so replace it by its character content
    descricao: typeof descricao === 'object' ? descricao._ : descricao,
    ...restEvent
  }
}
