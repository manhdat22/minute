function Content({ content }: any) {
  return (
    <div>
      <p
        className="post-content"
        dangerouslySetInnerHTML={{ __html: content }}
      ></p>
    </div>
  )
}

export default Content
