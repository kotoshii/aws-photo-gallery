import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";





type EagerFile = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<File, 'id'>;
  };
  readonly id: string;
  readonly s3key: string;
  readonly filename: string;
  readonly isFavorite?: boolean | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyFile = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<File, 'id'>;
  };
  readonly id: string;
  readonly s3key: string;
  readonly filename: string;
  readonly isFavorite?: boolean | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type File = LazyLoading extends LazyLoadingDisabled ? EagerFile : LazyFile

export declare const File: (new (init: ModelInit<File>) => File) & {
  copyOf(source: File, mutator: (draft: MutableModel<File>) => MutableModel<File> | void): File;
}