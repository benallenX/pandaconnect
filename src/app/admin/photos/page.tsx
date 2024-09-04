// app/admin/photos/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Trash } from 'lucide-react';

interface Photo {
	id: string;
	name: string;
	url: string;
}

export default function PhotoManagement() {
	const [photos, setPhotos] = useState<Photo[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [uploadingPhoto, setUploadingPhoto] = useState<File | null>(null);

	useEffect(() => {
		fetchPhotos();
	}, []);

	async function fetchPhotos() {
		try {
			const response = await fetch('/api/photos');
			if (response.ok) {
				const data = await response.json();
				setPhotos(data);
			} else {
				throw new Error('Failed to fetch photos');
			}
		} catch (error) {
			console.error('Error fetching photos:', error);
		} finally {
			setIsLoading(false);
		}
	}

	async function handlePhotoUpload(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		if (!file) return;

		setUploadingPhoto(file);

		const formData = new FormData();
		formData.append('photo', file);

		try {
			const response = await fetch('/api/photos/upload', {
				method: 'POST',
				body: formData,
			});

			if (response.ok) {
				const newPhoto = await response.json();
				setPhotos([...photos, newPhoto]);
			} else {
				throw new Error('Failed to upload photo');
			}
		} catch (error) {
			console.error('Error uploading photo:', error);
		} finally {
			setUploadingPhoto(null);
		}
	}

	async function deletePhoto(id: string) {
		try {
			const response = await fetch(`/api/photos/${id}`, {
				method: 'DELETE',
			});
			if (response.ok) {
				setPhotos(photos.filter((photo) => photo.id !== id));
			} else {
				throw new Error('Failed to delete photo');
			}
		} catch (error) {
			console.error('Error deleting photo:', error);
		}
	}

	if (isLoading) {
		return <div>Loading photos...</div>;
	}

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-3xl font-bold mb-6">Photo Management</h1>

			<div className="mb-8">
				<Label htmlFor="photo-upload" className="block mb-2">
					Upload New Photo
				</Label>
				<div className="flex items-center">
					<Input
						id="photo-upload"
						type="file"
						accept="image/*"
						onChange={handlePhotoUpload}
						disabled={!!uploadingPhoto}
						className="mr-4"
					/>
					{uploadingPhoto && <p>Uploading: {uploadingPhoto.name}</p>}
				</div>
			</div>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{photos.map((photo) => (
					<Card key={photo.id}>
						<CardContent className="p-4">
							<div className="relative aspect-square mb-4">
								<Image
									src={photo.url}
									alt={photo.name}
									layout="fill"
									objectFit="cover"
									className="rounded-md"
								/>
							</div>
							<div className="flex justify-between items-center">
								<p className="font-semibold">{photo.name}</p>
								<Button
									variant="destructive"
									size="icon"
									onClick={() => deletePhoto(photo.id)}>
									<Trash className="h-4 w-4" />
								</Button>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
