export interface UseCase {
    perform (requests: any): Promise<any>
}