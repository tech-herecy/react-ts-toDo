import React, { useState, useEffect } from 'react';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';
import FacebookLogin from 'react-facebook-login';
import InstagramEmbed from 'react-instagram-embed';
import './style.css';

const MapWithComment = (props) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const handleMapClick = (mapProps, map, clickEvent) => {
    setComments([
      ...comments,
      {
        lat: clickEvent.latLng.lat(),
        lng: clickEvent.latLng.lng(),
        text: commentText
      }
    ]);
    setCommentText('');
  };

  const handleCommentChange = (event) => {
    setCommentText(event.target.value);
  };

  const handleFacebookLogin = (response) => {
    setIsLoggedIn(true);
  };

  return (
    <div className="map-with-comment">
      <div className="map-container">
        <Map
          google={props.google}
          zoom={14}
          center={currentLocation}
          onClick={handleMapClick}
        >
          {currentLocation && <Marker position={currentLocation} />}
          {comments.map((comment, index) => (
            <Marker key={index} position={{ lat: comment.lat, lng: comment.lng }} />
          ))}
        </Map>
      </div>
      <div className="comment-container">
        <textarea
          value={commentText}
          maxLength={125}
          onChange={handleCommentChange}
          placeholder="Add a comment"
        />
        {isLoggedIn && (
          <div>
            <FacebookLogin
              appId="YOUR_APP_ID"
              fields="name,email,picture"
              callback={handleFacebookLogin}
            />
            <InstagramEmbed
              url="https://www.instagram.com/p/B4aGC4pFvZG/"
              maxWidth={320}
              hideCaption={false}
              containerTagName="div"
              protocol=""
              injectScript
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: 'YOUR_API_KEY'
})(MapWithComment);

