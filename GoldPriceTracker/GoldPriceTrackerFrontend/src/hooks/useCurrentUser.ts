import { useQuery } from "@tanstack/react-query"
import { getCurrentUser } from "../api/authApi"

export const useCurrentUser = () => {
    return useQuery({
        queryKey: ['currentUser'],
        queryFn: getCurrentUser,
    })
}