import { AuthProvider as Auth } from "@/features/auth";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => <Auth>{children}</Auth>;
