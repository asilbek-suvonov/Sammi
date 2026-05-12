export interface UserProfile {
  full_name: string;
  nickname: string;
  bio: string;
  avatar_url: string;
  language_code: string;
  country: string;
  email: string; // Faqat GET va Response larda keladi
}

export type UpdateProfilePayload = Omit<UserProfile, 'email'>;


// --- Password Types ---

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
  confirm_new_password: string;
}