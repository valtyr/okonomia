import { QueryClient, useMutation, useQuery } from 'react-query';

export const queryClient = new QueryClient();

export interface User {
  name: string;
  phone: string;
  kennitala: string;
  email: string;
  isInEconomics: boolean;
  imageKey: string;
  hasPaid: boolean;
  isAdmin: boolean;
  id: string;
}

export interface UsersResponse {
  users: User[];
}

export const useUsersQuery = () =>
  useQuery('users', () =>
    fetch('/api/users', {
      credentials: 'include',
    }).then((r) => r.json()),
  );

export const usePromoteToAdminMutation = () =>
  useMutation(
    (id: string) =>
      fetch(`/api/user/${id}/admin`, {
        method: 'PUT',
      }),
    {
      onMutate: async (id: string) => {
        await queryClient.cancelQueries('users');
        const previousUsers = await queryClient.getQueryData<UsersResponse>(
          'users',
        );
        queryClient.setQueryData<UsersResponse>('users', (old) => ({
          users:
            old?.users.map((user) => {
              if (user.id !== id) return user;
              return { ...user, isAdmin: true };
            }) || [],
        }));
        return { previousUsers };
      },
      onError: (err, newTodo, context) => {
        if (context?.previousUsers)
          queryClient.setQueryData('users', context.previousUsers);
      },
      onSettled: () => {
        queryClient.invalidateQueries('users');
      },
    },
  );

export const useDemoteToMemberMutation = () =>
  useMutation(
    (id: string) =>
      fetch(`/api/user/${id}/admin`, {
        method: 'DELETE',
      }),
    {
      onMutate: async (id: string) => {
        await queryClient.cancelQueries('users');
        const previousUsers = await queryClient.getQueryData<UsersResponse>(
          'users',
        );
        queryClient.setQueryData<UsersResponse>('users', (old) => ({
          users:
            old?.users.map((user) => {
              if (user.id !== id) return user;
              return { ...user, isAdmin: false };
            }) || [],
        }));
        return { previousUsers };
      },
      onError: (err, newTodo, context) => {
        if (context?.previousUsers)
          queryClient.setQueryData('users', context.previousUsers);
      },
      onSettled: () => {
        queryClient.invalidateQueries('users');
      },
    },
  );

export const useDeleteUserMutation = () =>
  useMutation(
    (id: string) =>
      fetch(`/api/user/${id}`, {
        method: 'DELETE',
      }),
    {
      onMutate: async (id: string) => {
        await queryClient.cancelQueries('users');
        const previousUsers = await queryClient.getQueryData<UsersResponse>(
          'users',
        );
        queryClient.setQueryData<UsersResponse>('users', (old) => ({
          users: old?.users.filter((user) => user.id !== id) || [],
        }));
        return { previousUsers };
      },
      onError: (err, newTodo, context) => {
        if (context?.previousUsers)
          queryClient.setQueryData('users', context.previousUsers);
      },
      onSettled: () => {
        queryClient.invalidateQueries('users');
      },
    },
  );

export const useCreateUserMutation = () =>
  useMutation(
    (body: {
      name: string;
      phone: string;
      kennitala: string;
      email: string;
      isInEconomics: boolean;
      imageKey: string;
      year: 'first' | 'second' | 'third' | 'other';
    }) =>
      fetch('/api/user/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }),
  );
