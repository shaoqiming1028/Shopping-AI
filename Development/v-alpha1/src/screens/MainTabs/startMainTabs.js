import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';


const startMainTabs = () => {

    Promise.all([
        Icon.getImageSource("ios-home", 30),
        Icon.getImageSource("ios-camera", 30),
        Icon.getImageSource("md-person", 30)
          
    ]).then(sources => {
        Navigation.startTabBasedApp({
            tabs:[
                {
                    label: 'Home',
                    screen: 'Shopping-Assistant.RecommendScreen',
                    title: 'Recommend',
                    icon: sources[0]
                },
                {
                    label: 'Photo',
                    screen: 'Shopping-Assistant.PhotoScreen',
                    title: 'Photo',
                    icon: sources[1]
                },
                {
                    label: 'Person',
                    screen: 'Shopping-Assistant.PersonalScreen',
                    title: 'Person',
                    icon: sources[2]
                }
            ]
        })
    })
}

export default startMainTabs;