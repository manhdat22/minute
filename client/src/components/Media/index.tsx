import { Image } from 'antd'

const VIDEO_EXTENSIONS = ['mp4']

function Media({ src }: any) {
  const ext = src.split('.').pop()
  const isVideo = VIDEO_EXTENSIONS.includes(ext)

  return (
    <div className="text-center mb-4">
      {isVideo ? (
        <video controls className="max-h-image w-full" src={src}></video>
      ) : (
        <Image preview={false} className="max-h-image" src={src} />
      )}
    </div>
  )
}

export default Media
