import React from 'react';
import {
  FiCornerUpLeft,
  FiCopy,
  FiArrowRight,
  FiStar,
  FiMapPin,
  FiTrash2,
  FiCheckSquare,
  FiShare2
} from 'react-icons/fi';
import './ContextMenu.css';

const ContextMenu = ({ 
  position, 
  isVisible, 
  onClose, 
  message, 
  onReply, 
  onCopy, 
  onForward, 
  onStar, 
  onPin, 
  onDelete, 
  onSelect, 
  onShare,
  onEmojiReact 
}) => {
  if (!isVisible) return null;

  const handleEmojiClick = (emoji) => {
    onEmojiReact(emoji);
    onClose();
  };

  const handleMenuAction = (action) => {
    switch (action) {
      case 'reply':
        onReply(message);
        break;
      case 'copy':
        onCopy(message);
        break;
      case 'forward':
        onForward(message);
        break;
      case 'star':
        onStar(message);
        break;
      case 'pin':
        onPin(message);
        break;
      case 'delete':
        onDelete(message);
        break;
      case 'select':
        onSelect(message);
        break;
      case 'share':
        onShare(message);
        break;
      default:
        break;
    }
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div className="context-menu-backdrop" onClick={onClose} />
      
      {/* Context Menu */}
      <div 
        className="context-menu"
        style={{
          left: position.x,
          top: position.y,
        }}
      >
        {/* Menu Actions */}
        <div className="context-menu-actions">
          <button 
            className="context-menu-item"
            onClick={() => handleMenuAction('reply')}
          >
            <FiCornerUpLeft className="context-menu-icon" />
            <span>Reply</span>
          </button>
          
          <button 
            className="context-menu-item"
            onClick={() => handleMenuAction('copy')}
          >
            <FiCopy className="context-menu-icon" />
            <span>Copy</span>
          </button>
          
          <button 
            className="context-menu-item"
            onClick={() => handleMenuAction('forward')}
          >
            <FiArrowRight className="context-menu-icon" />
            <span>Forward</span>
          </button>
          
          <button 
            className="context-menu-item"
            onClick={() => handleMenuAction('star')}
          >
            <FiStar className="context-menu-icon" />
            <span>Star</span>
          </button>
          
          <button 
            className="context-menu-item"
            onClick={() => handleMenuAction('pin')}
          >
            <FiMapPin className="context-menu-icon" />
            <span>Pin</span>
          </button>
          
          <button 
            className="context-menu-item"
            onClick={() => handleMenuAction('delete')}
          >
            <FiTrash2 className="context-menu-icon" />
            <span>Delete for me</span>
          </button>
          
          <button 
            className="context-menu-item"
            onClick={() => handleMenuAction('select')}
          >
            <FiCheckSquare className="context-menu-icon" />
            <span>Select</span>
          </button>
          
          <button 
            className="context-menu-item"
            onClick={() => handleMenuAction('share')}
          >
            <FiShare2 className="context-menu-icon" />
            <span>Share</span>
          </button>
        </div>
        
        {/* Emoji Reactions */}
        <div className="context-menu-reactions">
          <button 
            className="emoji-reaction-btn"
            onClick={() => handleEmojiClick('👍')}
            title="Thumbs Up"
          >
            👍
          </button>
          
          <button 
            className="emoji-reaction-btn"
            onClick={() => handleEmojiClick('❤️')}
            title="Red Heart"
          >
            ❤️
          </button>
          
          <button 
            className="emoji-reaction-btn"
            onClick={() => handleEmojiClick('😂')}
            title="Face with Tears of Joy"
          >
            😂
          </button>
          
          <button 
            className="emoji-reaction-btn"
            onClick={() => handleEmojiClick('😮')}
            title="Face with Open Mouth"
          >
            😮
          </button>
          
          <button 
            className="emoji-reaction-btn"
            onClick={() => handleEmojiClick('🥺')}
            title="Pleading Face"
          >
            🥺
          </button>
          
          <button 
            className="emoji-reaction-btn"
            onClick={() => handleEmojiClick('🙏')}
            title="Folded Hands"
          >
            🙏
          </button>
          
          <button 
            className="emoji-reaction-btn plus-btn"
            title="Add More Reactions"
          >
            +
          </button>
        </div>
      </div>
    </>
  );
};

export default ContextMenu;
