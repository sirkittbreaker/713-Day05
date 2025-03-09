import * as repo from "../repository/participantRepositoryPrisma";

export async function getAllParticipantsWithPagination(
  keyword: string,
  pageSize: number,
  pageNo: number
) {
  const pageParticipants = await repo.getAllParticipantsWithPagination(
    keyword,
    pageSize,
    pageNo
  );
  return pageParticipants;
}
