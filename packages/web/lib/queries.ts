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
  hasReceivedPass?: boolean;
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

export const useSetHasPaidMutation = () =>
  useMutation(
    ({ id, hasPaid }: { id: string; hasPaid: boolean }) =>
      fetch(`/api/user/${id}/payment`, {
        method: 'POST',
        body: JSON.stringify({ hasPaid }),
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    {
      onMutate: async ({ id, hasPaid }: { id: string; hasPaid: boolean }) => {
        await queryClient.cancelQueries('users');
        const previousUsers = await queryClient.getQueryData<UsersResponse>(
          'users',
        );
        queryClient.setQueryData<UsersResponse>('users', (old) => ({
          users:
            old?.users.map((user) => {
              if (user.id !== id) return user;
              return { ...user, hasPaid };
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

export const useSendPassMutation = () =>
  useMutation(
    (id: string) =>
      fetch(`/api/user/${id}/pass/send`, {
        method: 'POST',
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
              return { ...user, hasReceivedPass: true };
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

export const useCreateUserMutation = () =>
  useMutation(
    async (body: {
      name: string;
      phone: string;
      kennitala: string;
      email: string;
      isInEconomics: boolean;
      imageKey: string;
      year: 'first' | 'second' | 'third' | 'other';
    }) => {
      const res = await fetch('/api/user/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const responseBody = await res.json();

      if (!res.ok) {
        throw new Error('Villa kom upp!');
      }

      if (responseBody.error) {
        return { error: responseBody.error };
      }

      return { data: responseBody };
    },
  );
