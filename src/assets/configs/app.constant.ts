export const CORRECT = 1;
export const INCORRECT = 0;

export const REQUEST_USER_KEY='user';

export const CLOUDINARY = {
  PROVIDER: 'CLOUDINARY',
  SERVICE: 'cloudinary'
};

export const QUEUE = {
  UPLOAD_IMAGE: 'image_upload',
  SEND_EMAIL: 'system_email_send'
};

export const MAX_SIZE = 100;
export const DEFAULT_SIZE = 40;
export const DEFAULT_PAGE = 1;

export const UNIQUE_CODE_LENGTH = 32;
export const RANDOM_NUMBER_LENGTH = 1000000;

export const NATS_MESSAGE_BROKER = Symbol('nats-message-broker'); // renamed
export const INFORMATION_SERVICE = Symbol("information-service");
export const INVENTORY_SERVICE = Symbol("inventory-service");
export const DELIVERY_SERVICE = Symbol("delivery-service");
export const ACCOUNT_SERVICE = Symbol("account-service");
export const ORGANISATION_SERVICE = Symbol("organisation-service");
export const NOTIFICATION_SERVICE = Symbol("notification-service");
export const INTELLIGENT_SERVICE = Symbol("intelligent-service");
export const PROMOTION_SERVICE = Symbol("promotion-service");
export const PROTECTION_SERVICE = Symbol("protection-service");
export const FILESYSTEM_SERVICE = Symbol("filesystem-service");