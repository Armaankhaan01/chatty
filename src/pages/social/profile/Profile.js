import { useCallback, useEffect, useState } from 'react';
import './Profile.scss';
import BackgroundHeader from '@components/background-header/BackgroundHeader';
import { Utils } from '@services/utils/utils.service';
import { imageService } from '@services/image/image.service';
import { userService } from '@services/api/user/user.service';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import { tabItems } from '@services/utils/static.data';

const Profile = () => {
  const { profile } = useSelector((state) => state.user);
  const [user, setUser] = useState();
  const [rendered, setRendered] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [hasImage, setHasImage] = useState(false);
  const [selectedBackgroundImage, setSelectedBackgroundImage] = useState('');
  const [selectedProfileImage, setSelectedProfileImage] = useState('');
  const [bgUrl, setBgUrl] = useState('');
  const [galleryImages, setGalleryImages] = useState([]);
  const [displayContent, setDisplayContent] = useState('timeline');
  const [loading, setLoading] = useState(true);
  const [userProfileData, setUserProfileData] = useState(null);
  const dispatch = useDispatch();
  const { username } = useParams();
  const [searchParams] = useSearchParams();

  const changeTabContent = (data) => {
    setDisplayContent(data);
  };

  const selectedFileImage = (data, type) => {
    setHasImage(!hasImage);
    if (type === 'background') {
      setSelectedBackgroundImage(data);
    } else {
      setSelectedProfileImage(data);
    }
  };

  const cancelFileSelection = () => {
    setHasImage(!hasImage);
    setSelectedBackgroundImage('');
    setSelectedProfileImage('');
    setHasError(false);
  };

  const getUserProfileByUsername = useCallback(async () => {
    try {
      const response = await userService.getUserProfileByUsername(
        username,
        searchParams.get('id'),
        searchParams.get('uId')
      );
      setUser(response.data.user);
      setUserProfileData(response.data);
      setBgUrl(Utils.getImage(response.data.user?.bgImageId, response.data.user?.bgImageVersion));
      setLoading(false);
    } catch (error) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  }, [dispatch, searchParams, username]);

  const getUserImages = useCallback(async () => {
    try {
      const imagesResponse = await imageService.getUserImages(searchParams.get('id'));
      setGalleryImages(imagesResponse.data.images);
    } catch (error) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  }, [dispatch, searchParams]);

  const saveImage = (type) => {
    const reader = new FileReader();
    reader.addEventListener('load', async () => addImage(reader.result, type), false);

    if (selectedBackgroundImage && typeof selectedBackgroundImage !== 'string') {
      reader.readAsDataURL(Utils.renameFile(selectedBackgroundImage));
    } else if (selectedProfileImage && typeof selectedProfileImage !== 'string') {
      reader.readAsDataURL(Utils.renameFile(selectedProfileImage));
    } else {
      addImage(selectedBackgroundImage, type);
    }
  };

  const addImage = async (result, type) => {
    try {
      const url = type === 'background' ? '/images/background' : '/images/profile';
      const response = await imageService.addImage(url, result);
      if (response) {
        Utils.dispatchNotification(response.data.message, 'success', dispatch);
        setHasError(false);
        setHasImage(false);
      }
    } catch (error) {
      setHasError(true);
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };

  const removeBackgroundImage = async (bgImageId) => {
    try {
      setBgUrl('');
      await removeImage(`/images/background/${bgImageId}`);
    } catch (error) {
      setHasError(true);
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };

  const removeImage = async (url) => {
    const response = await imageService.removeImage(url);
    Utils.dispatchNotification(response.data.message, 'success', dispatch);
  };

  useEffect(() => {
    if (rendered) {
      getUserProfileByUsername();
      getUserImages();
    }
    if (!rendered) setRendered(true);
  }, [rendered, getUserProfileByUsername, getUserImages]);

  return (
    <>
      <div className="profile-wrapper">
        <div className="profile-wrapper-container">
          <div className="profile-header">
            <BackgroundHeader
              user={user}
              loading={loading}
              hasImage={hasImage}
              hasError={hasError}
              url={bgUrl}
              onClick={changeTabContent}
              selectedFileImage={selectedFileImage}
              saveImage={saveImage}
              cancelFileSelection={cancelFileSelection}
              removeBackgroundImage={removeBackgroundImage}
              tabItems={tabItems(username === profile?.username, username === profile?.username)}
              tab={displayContent}
              hideSettings={username === profile?.username}
              galleryImages={galleryImages}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default Profile;
