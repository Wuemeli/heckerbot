export interface MemberData {
    userId: string;
    username: string;
    discriminator: string;
    avatarUrl: string;
    joinedTimestamp: number;
    roles: string[];
    bot: boolean;
    tag: string;
    nickname: string;
    accentColor: number;
}
