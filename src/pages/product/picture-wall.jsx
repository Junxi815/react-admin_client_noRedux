import React from 'react'
import { Upload, Icon, Modal, message } from 'antd'
import PropTypes from 'prop-types'

import {reqDeleteImg} from '../../api'
import {BASE_IMG_URL} from '../../utils/constants'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends React.Component {

  static propTypes = {
    imgs: PropTypes.array
  }
  
  constructor(props){
    super(props)
    let fileList = []
    const {imgs} = this.props
    if(imgs && imgs.length>0){
      fileList =  imgs.map((img,index)=>({
        uid: -index,
        name: img,
        status: 'done',
        url: BASE_IMG_URL+img
      }))
    }
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList
    }
  }

  getImgs = () => {
    return this.state.fileList.map(file => file.name)
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  handleChange = async ({ file, fileList }) => {
    //attention: file and fileList's one element is different object even though they have same content
    if(file.status==='done'){
      const result = file.response
      if(result.status === 0){
        message.success('Uploaded piture successfully')
        const {name, url} = result.data
        //redirect file to fileList's last element, because they have same content but different memory location
        file = fileList[fileList.length-1]
        file.name = name
        file.url = url
      }else{
        message.error('Failed to upload this picture')
      }
    }else if(file.status==='removed'){
      // console.log('file',file.url)
      const result = await reqDeleteImg(file.name)
      if(result.status===0){
        message.success('Deleted image successfully.')
      }else{
        message.error('Failed to delete this image.')
      }
    }
    this.setState({ fileList })
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div>Upload</div>
      </div>
    );
    return (
      <div>
        <Upload
          action="/manage/img/upload"  //uploading URL
          accept='image/*'  //file types that can be accepted
          listType="picture-card"
          name='image'  //the name of uploading file as api parameter
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
