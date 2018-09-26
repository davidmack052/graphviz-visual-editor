import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

class MainMenu extends React.Component {

  handleClose = () => {
    this.props.onMenuClose();
  };

  handleSettings = () => {
    this.props.onMenuClose();
    this.props.onSettingsClick();
  };

  handleNew = () => {
    this.props.onMenuClose();
    this.props.onNewClick();
  };

  handleOpenFromBrowser = () => {
    this.props.onMenuClose();
    this.props.onOpenFromBrowserClick();
  };

  handleSaveAsToBrowser = () => {
    this.props.onMenuClose();
    this.props.onSaveAsToBrowserClick();
  };

  render() {

    return (
      <div>
        <Menu
          id="main-menu"
          anchorEl={this.props.anchorEl}
          open
          onClose={this.handleClose}
        >
          <MenuItem onClick={this.handleNew}>New</MenuItem>
          <MenuItem onClick={this.handleOpenFromBrowser}>Open from browser</MenuItem>
          <MenuItem onClick={this.handleSaveAsToBrowser}>Save as to browser</MenuItem>
          <MenuItem onClick={this.handleSettings}>Settings</MenuItem>
        </Menu>
      </div>
    );
  }
}

export default MainMenu;
