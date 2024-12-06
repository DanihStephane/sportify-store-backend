import * as crypto from 'crypto';
import slugify from 'slugify';

export const hashGenerator = () => {
    const hash = crypto.createHash('sha256');
    const randomBytes = crypto.randomBytes(32).toString('hex');
    const hashToken = hash.update(randomBytes).digest('hex');
    return hashToken;
}

export function slug(text: string): string {
	const slugText = slugify(text, '-').toLowerCase();
	return slugText;
}
