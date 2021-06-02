var Webflow = Webflow || [];
Webflow.push(function () {

    MemberStack.onReady.then(function (member) {

        let uid = member["user-id"];
        let cid = member["company-id"];

        var database = firebase.database();
        var petRefObject = database.ref(`${cid}/`);
        const wrapper = document.getElementById('wrapper');

        var query = firebase.database().ref(`${cid}/`);
        query.once('value')
            .then(function (snapshot) {
                snapshot.forEach(function (childSnapshot) {
                    var unique = childSnapshot.key;
                    var childData = childSnapshot.val();
                    var name = childData.name;
                    var pageStatus = childData.activePage;
                    var id = childData.id;
                    var imgSrc = childData.picture;
                    var groomStatus = childData.grooming;

                    if (pageStatus == true) {
                        createCard(id, imgSrc, name, pageStatus, groomStatus);
                    }
                });
            });

        petRefObject.on('child_changed', function (snapshot) {
            var change = snapshot.val();
            var petName = change.name;
            var petId = change.id;
            var owner = change.owner;
            var picture = change.picture;
            var pageStatus = change.activePage;
            var groomStatus = change.grooming;

            var card = document.getElementById(`cardItem_${petId}`);
            var vpsPagingStatus = document.getElementById(`pageParent_${petId}`);
            if (vpsPagingStatus) {
                var leavingAttr = vpsPagingStatus.getAttribute('leaving');
            }

            if (pageStatus == true && card == null) {
                createCard(petId, picture, petName, pageStatus, groomStatus);
            } else if (pageStatus == true && leavingAttr) {
                if (leavingAttr != groomStatus) {
                    if (groomStatus == true) {
                        vpsPagingStatus.style.backgroundColor = '#ff2e2e';
                        vpsPagingStatus.innerHTML = 'GROOMING';
                        vpsPagingStatus.setAttribute('leaving', 'false');
                    } else {
                        vpsPagingStatus.style.backgroundColor = '#2e5bff';
                        vpsPagingStatus.innerHTML = 'LEAVING';
                        vpsPagingStatus.setAttribute('leaving', 'true');
                    }
                }
            } else if (pageStatus == false) {
                card.outerHTML = "";
            }

        });

        petRefObject.on('child_removed', function (snapshot) {
            var removedData = snapshot.val();
            var cardId = removedData.id;
            var cardElem = 'cardItem_' + cardId;
            var cardElemExist = document.getElementById(cardElem);

            if (cardElemExist !== null) {
                cardElemExist.outerHTML = '';
                console.log(`The Page Card element with an ID of ${cardId} was removed from the website.`);
            }
        });

        function createCard(identifier, src, pupName, pageBool, groomBool) {

            const cardItem = document.createElement('div');
            cardItem.setAttribute('class', 'vps-card');
            cardItem.setAttribute('id', `cardItem_${identifier}`);
            wrapper.appendChild(cardItem);

            const cardItemContent = document.createElement('div');
            cardItemContent.setAttribute('class', 'vps-card-content');
            cardItem.appendChild(cardItemContent);

            const cardDogImageParent = document.createElement('div');
            cardDogImageParent.setAttribute('class', 'image-container xl');
            cardItemContent.appendChild(cardDogImageParent);

            const cardDogImage = document.createElement('img');
            cardDogImage.setAttribute('src', src);
            cardDogImageParent.appendChild(cardDogImage);

            const cardDogNameParent = document.createElement('div');
            cardDogNameParent.setAttribute('class', 'card-dog-name');
            cardItemContent.appendChild(cardDogNameParent);

            const cardDogName = document.createElement('p');
            cardDogName.setAttribute('class', 'vps-name');
            cardDogName.textContent = pupName;
            cardDogNameParent.appendChild(cardDogName);

            if (groomBool == true) {
                let pageParent = document.createElement('div');
                pageParent.setAttribute('id', `pageParent_${identifier}`);
                pageParent.setAttribute('class', 'vps-page-status red');
                pageParent.setAttribute('leaving', 'false');
                pageParent.innerHTML = 'GROOMING';
                cardItem.appendChild(pageParent);
            } else {
                let pageParent = document.createElement('div');
                pageParent.setAttribute('id', `pageParent_${identifier}`);
                pageParent.setAttribute('class', 'vps-page-status');
                pageParent.setAttribute('leaving', 'true');
                pageParent.innerHTML = 'LEAVING';
                cardItem.appendChild(pageParent);
            }
        }

    });
});
