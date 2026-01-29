'use client';

import { Post } from '@/types/post';
import { MarkdownPreview } from '@/components/editor/markdown-preview';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Share2, Check } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

interface PostViewProps {
	post: Post;
}

export function PostView({ post }: PostViewProps) {
	const [copied, setCopied] = useState(false);

	const handleShare = async () => {
		const url = window.location.href;

		try {
			await navigator.clipboard.writeText(url);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			alert('URL 복사에 실패했습니다: ' + url);
		}
	};

	return (
		<div className='min-h-screen bg-white'>
			<header className='border-b sticky top-0 bg-white z-10'>
				<div className='max-w-4xl mx-auto px-4 py-4 flex items-center justify-between'>
					<Button variant='outline' size='sm' onClick={handleShare} className='ml-auto'>
						{copied ? (
							<>
								<Check className='w-4 h-4 mr-2' />
								복사됨
							</>
						) : (
							<>
								<Share2 className='w-4 h-4 mr-2' />
								공유
							</>
						)}
					</Button>
				</div>
			</header>

			<main className='max-w-4xl mx-auto px-4 py-8'>
				<article>
					<h1 className='text-3xl font-bold mb-4'>{post.title}</h1>
					<p className='text-gray-500 text-sm mb-8'>
						{new Date(post.updatedAt).toLocaleDateString('ko-KR', {
							year: 'numeric',
							month: 'long',
							day: 'numeric',
						})}
					</p>
					<div className='prose prose-stone max-w-none'>
						<MarkdownPreview content={post.content} />
					</div>
				</article>
			</main>
		</div>
	);
}
