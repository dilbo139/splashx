import { basicClient } from "@/lib/initClient";
import { gql } from "urql";

// export const getPublicationsQuery = `
//   query Publications($id: ProfileId!, $limit: LimitScalar) {
//     publications(request: {
//       profileId: $id,
//       publicationTypes: [POST],
//       limit: $limit,
//       metadata: { mainContentFocus: VIDEO }
//     }) {
//       items {
//         __typename
//         ... on Post {
//           ...PostFields
//         }
//       }
//     }
//   }
//   fragment PostFields on Post {
//     id
//     metadata {
//       ...MetadataOutputFields
//     }
//     onChainContentURI
//   }
//   fragment MetadataOutputFields on MetadataOutput {
//     name,
//     description,
//     content,
//     image,
//     cover {
//       original {
//         url
//       }
//     },
//     tags,
//   }
// `;

export const getPublicationsQuery = gql`
  query Query($request: PublicationsQueryRequest!) {
    publications(request: $request) {
      items {
        ... on Post {
          profile {
            id
            handle
            name
            picture {
              ... on MediaSet {
                original {
                  url
                }
              }
            }
          }
          id
          metadata {
            image
            mainContentFocus
            description
            content
          }
        }
      }
    }
  }
`;

export const getPublicationQueryVariables = function (profileIds: string[]) {
  return {
    request: {
      limit: 5,
      publicationTypes: "POST",
      metadata: {
        mainContentFocus: "VIDEO",
      },
      profileIds: null,
    },
  };
};

/**
 * Load a user's publications by their profile id.
 */
// export async function getPublications(
//   profileId: string,
//   limit: number,
// ): Promise<any> {
//   const response = await basicClient
//     .query(getPublicationsQuery, {
//       id: profileId,
//       limit: limit,
//     })
//     .toPromise();

//   return response.data.publications.items as any[];
// }
export async function getPublications(profileIds: string[]): Promise<any> {
  const response = await basicClient
    .query(getPublicationsQuery, getPublicationQueryVariables(profileIds))
    .toPromise();

  return response.data.publications.items as any[];
}
