import React, { Component } from "react";

import './upload.css';

const cloudName = 'ddycd5xyn';
const unsignedUploadPreset = 'rq6jvg1m';


class UploadDetailsToCloudinary extends Component {
    constructor(props){
      super(props);
      this.state = {
        detailsImage:'',
        status:false
      }
    }
    handleClickCover=(e)=>{
        if(this.refs.fileElemDetails){
            fileElemDetails.click();
        }
        e.preventDefault();
        return false;
    }
// ************************ Drag and drop拖拽 ***************** //

    handleDrapenter=(e)=>{
        e.stopPropagation();
        e.preventDefault();
    }

    handleDrapover=(e)=>{
        e.stopPropagation();
        e.preventDefault();
    }
    handleDrop=(e)=>{
        e.stopPropagation();
        e.preventDefault();
        let dt = e.dataTransfer;
        let files = dt.files;
        this.handleFiles(files);
    }

    handleFiles = (files) => {
        for (var i = 0; i < files.length; i++) {
            this.uploadFile(files[i]); // call the function to upload the file
          }
    }

    uploadFile = (file) => {
        console.log(file);
        var url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
        var xhr = new XMLHttpRequest();
        var fd = new FormData();
        xhr.open('POST', url, true);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

        // Reset the upload progressDetails bar
         document.getElementById('progressDetails').style.width = 0;

        // Update progressDetails (can be used to show progressDetails indicator)
        xhr.upload.addEventListener("progressDetails", function(e) {
          var progressDetails = Math.round((e.loaded * 100.0) / e.total);
          document.getElementById('progressDetails').style.width = progressDetails + "%";

          console.log(`fileuploadprogress data.loaded: ${e.loaded},
        data.total: ${e.total}`);
        });

        xhr.onreadystatechange = (e) => {
          if (xhr.readyState == 4 && xhr.status == 200) {
            // File uploaded successfully
            var response = JSON.parse(xhr.responseText);
            // https://res.cloudinary.com/cloudName/image/upload/v1483481128/public_id.jpg
            var url = response.secure_url;
            // Create a thumbnail of the uploaded image, with 150px width
            // var tokens = url.split('/');
            // tokens.splice(-2, 0, 'w_150,c_scale');
            var img = new Image(); // HTML5 Constructor

            let remoteUrl = url;
            console.log(remoteUrl);

            img.src = url;
            this.setState({
              detailsImage:img.src,
              status:true
            })
              this.props.getRemoteDetails(this.state.detailsImage);

            img.alt = response.public_id;
            console.log(img);
            // document.getElementById('gallery').appendChild(img);
          }
        };

        fd.append('upload_preset', unsignedUploadPreset);
        fd.append('tags', 'browser_upload'); // Optional - add tag for image admin in Cloudinary
        fd.append('file', file);
        xhr.send(fd);
    }

    handleFileChange=(e)=>{
        let files =  this.refs.fileElemDetails.files;
        this.uploadFile(files[0]);
    }

    componentDidMount(){
        let fileElemDetails = this.refs.fileElemDetails;
    }
    componentWillReceiveProps(nextProps){
      console.log(nextProps);
      console.log(nextProps.images_state);
    //   if (!nextProps.images_state) {
    //     console.log('aaa');
    //   let cover = nextProps.cover;
    //   let self = this;
    //   self.setState({
    //     cover:cover
    //   })
    // }
    let self = this;
    let detailsImage = nextProps.detailsImage;
    console.log(detailsImage);
    console.log(self.state.status);
    if (nextProps.images_state) {
        self.setState({
          status:false
        })
    }
    if (!this.state.status) {
      self.setState({
          detailsImage:detailsImage
        })
    }

    }
    render() {
        return (
            <div id="dropbox"
            onDragEnter={(e)=>this.handleDrapenter(e)}
            onDragOver={(e)=>this.handleDrapover(e)}
            onDrop={(e)=>this.handleDrop(e)}
            >
              <div style={{width:'100%'}}>
                    <span style={{textAlign:"center"}}><a href="#" id="fileSelect" onClick={(e)=>this.handleClickCover(e)}>点击选择图片</a></span>
              </div>
                    <form className="my-form">
                        <div className="form_line">
                        <div className="form_controls">
                            <div className="upload_button_holder">
                            <input onChange={(e)=>this.handleFileChange(e)} ref="fileElemDetails" type="file" id="fileElemDetails" multiple accept="image/*" style={{display: "none"}} />

                            </div>
                        </div>
                        </div>
                    </form>
                    <div className="progressDetails-bar" id="progressDetails-bar">
                        <div className="progressDetails" id="progressDetails"></div>
                    </div>
                    <div id="gallerydetails" >
                    <img src={this.state.detailsImage} />
                    </div>
            </div>
        );
    }
}


export default UploadDetailsToCloudinary;
