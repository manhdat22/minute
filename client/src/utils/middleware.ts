// import { openLoading, closeLoading } from 'stores/common/commonSlice'

// const loading =
//   ({ dispatch }: { dispatch: any }) =>
//   (next: (arg: any) => void) =>
//   (action: { type: any }) => {
//     const type = action.type

//     if (type.endsWith('pending')) {
//       dispatch(openLoading())
//     } else if (type.endsWith('fulfilled') || type.endsWith('rejected')) {
//       dispatch(closeLoading())
//     }

//     next(action)
//   }

// export default loading

export default {}
