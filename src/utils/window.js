import {message, Modal} from 'antd'

export function showSuccess(content) {
  message.success(content)
}

export function alertError(title, content) {
  Modal.error({title, content})
}

export function alertWarning(title, content) {
  Modal.warning({title, content})
}
