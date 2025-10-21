export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/apple',
      permanent: false,
    },
  };
}

export default function IndexRedirect() {
  return null;
}
