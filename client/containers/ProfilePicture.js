import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {reduxForm} from 'redux-form';
import * as ProfilePictureActions from '../actions/pictureActions.js';

class ProfilePicture extends Component {

   videoError(e) {
     console.log('error with video intialization', e);
   }

   takePicture() {
    // http://matthewschrager.com/2013/05/25/how-to-take-webcam-pictures-from-browser-and-store-server-side/
    let canvas = document.querySelector("#picDisplay");
    let video = document.querySelector("#videoElement");
    canvas.width = 624;
    canvas.height = 468;
    canvas.getContext('2d').drawImage(video,0,0);
  
    let imgData = canvas.toDataURL("img/webp");
    // extract data in base 64 encoded webp format
    imgData = imgData.replace('data:image/webp;base64,','');
    let postData = JSON.stringify({imgData: imgData});
    // post to server 
      // ASYNC:
      // writeFile to profilePics
      // 
  }

  uploadPicture() {
    let reader = new FileReader();
    let canvas = document.querySelector("#picDisplay");
    let background = new Image();
    background.src = "https://pbs.twimg.com/profile_images/562466745340817408/_nIu8KHX.jpeg";

    canvas.width = 624;
    canvas.height = 468;

    canvas.getContext('2d').drawImage(background,0,0);
    
  }

  componentDidMount(){
    // http://www.kirupa.com/html5/accessing_your_webcam_in_html5.htm
    let video = document.querySelector("#videoElement");
    function handleVideo(stream) {
      // comment this out and then uncomment to see
      video.src = window.URL.createObjectURL(stream);
    };
    
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
   
    if (navigator.getUserMedia) {       
        navigator.getUserMedia({video: true}, handleVideo, this.videoError);
    }
  }
  handleClick(item){
    console.log("EVENT",event);
    console.log(item);
    console.log(this);
    const {actions, user} = this.props;

    console.log(actions.updatePic)
    actions.updatePic(item,user.user_id);

  }

  render() {
    const videoElementStyle = {
      width: 200,
      height: 'auto',
      // paddingBottom: 50,
      // backgroundColor: '#eee',
      clear: 'all'
    }

    const displayElementStyle = {
      width: 200,
      // height: 200,
      // backgroundColor: '#eee',
      clear: 'all'
    }

    const picButtonStyle = {
      borderRadius: 5,
      float: 'left',
      clear: 'all'
    }

    const imageStyle = {
      height: 200,
      width: 200
    }

    const {actions, user} = this.props;
    console.log(actions);
    console.log(user);

    let photos = ['https://i.ytimg.com/vi/tntOCGkgt98/maxresdefault.jpg', 'http://www.cats.org.uk/uploads/branches/211/5507692-cat-m.jpg']
    let photoAlbum = [];
    
    // for (var i = 0; i < (photos ? photos.length : 0); i++) {
    //   photoAlbum.push(<div><img src={photos[i]} style={imageStyle}/><br></br>
    //     <button type="button" style={picButtonStyle} key={i} onClick={(event) => this.handleClick(event)}>Use as Profile Picture</button><br></br>
    //     </div>);
    // }

    // photos.map(item =>
    //   '<div><img src='+ {item} + 'style=' + {imageStyle} + '/><br></br>' + 
    //     '<button type="button" style=' + {picButtonStyle} + 'onClick={() => {console.log("clicked")}}>Use as Profile Picture</button><br></br></div>').join('');
    let self = this;
    let photosMap = photos.map(function(item,i) {
      return <div><img src={item} key={i} style={imageStyle} /><br></br><button type="button" style={picButtonStyle} onClick={self.handleClick.bind(self, item)}>Use as Profile Picture</button><br></br></div>
    });

    return (
      <div>

        <h4>Option 1. Choose from your existing photos</h4>

          <p>Your pictures:</p>
          <div>{photosMap}</div>

        <h4>Option 2. Upload a picture</h4>

          <input type="file" id="myFile" onchange={ () => {console.log('clicked')}} />

        <h4>Option 3. Snap the perfect shot now using your device camera!</h4>

          <div>
            <video style={videoElementStyle} autoPlay="true" id="videoElement"></video>
            <canvas style={displayElementStyle} id="picDisplay"></canvas>
          </div>

          <button type="button" style={picButtonStyle} onClick={() => {this.takePicture()}}>Take a new Profile Picture</button>
          <button type="button" style={picButtonStyle} onClick={() => {console.log('clicked')}}>Use as Profile Picture</button>
        
        <br></br>
        <br></br>
      </div>
    )
  }
}

ProfilePicture.propTypes = {
  actions: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(ProfilePictureActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfilePicture);