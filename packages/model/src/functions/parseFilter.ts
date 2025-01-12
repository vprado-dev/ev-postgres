import { Knex } from "knex";
import { SortableFilterProps } from "../types/SortableFilterProps";
import { escapeLike } from "./escapeLike";

export const parseFilter =
  <T>(filter: SortableFilterProps<T>) =>
  (builder: Knex.QueryBuilder): void => {
    if (filter.$eq) {
      const keys = Object.keys(filter.$eq) as (keyof T)[];
      for (const key of keys) {
        builder.andWhere(key, "=", filter.$eq[key] as any);
      }
    }
    if (filter.$in) {
      const keys = Object.keys(filter.$in);
      for (const key of keys) {
        builder.whereIn(key, filter.$in[key as keyof T]);
      }
    }
    if (filter.$like) {
      const keys = Object.keys(filter.$like) as (keyof T)[];
      for (const key of keys) {
        builder.andWhereRaw(`lower("${key}") like lower(?)`, [
          "%" + escapeLike(`${filter.$like[key as keyof T]}`) + "%",
        ]);
      }
    }
    if (filter.$regex) {
      const keys = Object.keys(filter.$regex);
      for (const key of keys) {
        const regex = filter.$regex[key as keyof T];
        builder.andWhere(
          key,
          regex.flags.includes("i") ? "~*" : "~",
          regex.source
        );
      }
    }
    if (filter.$null) {
      const keys = filter.$null;
      for (const key of keys) {
        builder.whereNull(key);
      }
    }
    if (filter.$notnull) {
      const keys = filter.$notnull;
      for (const key of keys) {
        builder.whereNotNull(key);
      }
    }
    if (filter.$limit) {
      builder.limit(filter.$limit);
    }
    if (filter.$offset) {
      builder.offset(filter.$offset);
    }
    if (filter.$sort) {
      builder.orderBy(filter.$sort);
    }
  };
