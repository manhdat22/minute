/* eslint-disable react-hooks/rules-of-hooks */
import { message } from 'antd'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { resetFlashMessage } from '../../stores/commonSlice'
import { RootState } from '../../stores/rootReducer'

function FlashMessage() {
  const dispatch = useDispatch()
  const flashMessage = useSelector((state: RootState) => state.common.message)
  const flashMessageType = useSelector(
    (state: RootState) => state.common.messageType,
  )
  const options = {
    maxCount: 1,
    content: flashMessage,
    onClose: () => dispatch(resetFlashMessage({})),
  }

  useEffect(() => {
    if (flashMessage) (message as any)[flashMessageType](options)
  })

  return null
}

export default FlashMessage
