import { DEFAULT_TAKE_VALUE } from "../constant";

export function prismaSkipPage(pointer: number, pageSize?: number): number {
  return pageSize
    ? pageSize * (pointer - 1)
    : DEFAULT_TAKE_VALUE * (pointer - 1);
}

export function prismaTakePage(pageSize = 0): number {
  return pageSize >= 10 ? DEFAULT_TAKE_VALUE : pageSize;
}

export function prismaTotalPage(counter: number, pageSize: number): number {
  return counter % pageSize === 0
    ? counter / pageSize
    : Math.trunc(counter / pageSize) + 1;
}
