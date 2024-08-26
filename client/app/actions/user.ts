'use server'
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

// import { revalidatePath } from 'next/cache';


export async function addProjectKey(projectKey: string) {
  const { userId } = auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  if (!projectKey) {
    throw new Error('Project key is required');
  }

  try {
    const user = await prisma.user.update({
      where: { clerkId: userId },
      data: {
        projectKeys: {
          push: projectKey
        }
      }
    });

    return { success: true, projectKeys: user.projectKeys };
  } catch (error) {
    console.error('Failed to add project key:', error);
    throw new Error('Failed to add project key');
  }
}

export async function removeProjectKey(projectKey: string) {
  const { userId } = auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  if (!projectKey) {
    throw new Error('Project key is required');
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const updatedKeys = user.projectKeys.filter(key => key !== projectKey);

    const updatedUser = await prisma.user.update({
      where: { clerkId: userId },
      data: {
        projectKeys: updatedKeys
      }
    });

    return { success: true, projectKeys: updatedUser.projectKeys };
  } catch (error) {
    console.error('Failed to remove project key:', error);
    throw new Error('Failed to remove project key');
  }
}

export async function getAllProjectKeys() {
  const { userId } = auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { projectKeys: true }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user.projectKeys;
  } catch (error) {
    console.error('Failed to fetch project keys:', error);
    throw new Error('Failed to fetch project keys');
  }
}

export async function findProjectKey(key: string) {
  const { userId } = auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  if (!key) {
    throw new Error('Project key is required');
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { projectKeys: true }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const foundKey = user.projectKeys.find(projectKey => projectKey === key);

    return foundKey ? { found: true, key: foundKey } : { found: false, key: null };
  } catch (error) {
    console.error('Failed to find project key:', error);
    // throw new Error();
  }
}