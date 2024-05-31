import { Step } from 'intro.js-react';

const steps: Step[] = [
    {
        element: "#helpBtn",
        title: "Neurons and Activation Functions",
        intro: "Welcome to your first AI lesson! In this lesson, we will build and train a simple neural network. Let's get started by understanding what a neuron is and how it works.",
    },
    {
        element: "#helpBtn",
        title: "Neurons and Activation Functions",
        intro: "A neuron is the basic building block of a neural network. It takes inputs, applies a weight to each input, sums them up, adds a bias, and passes the result through an activation function to produce an output.",
    },
    {
        element: "#trainingSetSelector",
        title: "Neurons and Activation Functions",
        intro: "Task 1: Select the first training set y=2x+1 and Connect the output neuron to the input feature on the playground. Close this pop-up and press the '?' button once you are ready to proceed.",
    },
    {
        element: "#trainingSetSelector",
        title: "Neurons and Activation Functions",
        intro: "Great! Now let's choose an activation function for our neuron. Activation functions determine the output of a neuron. Common activation functions include Tanh and ReLU.",
    },
    {
        element: "#activationSelector",
        title: "Neurons and Activation Functions",
        intro: "Task 2: Select the ReLU activation function for your neuron.",
    },
    {
        element: "#helpBtn",
        title: "Layers in a Neural Network",
        intro: "Neurons can be combined into layers. A layer consists of multiple neurons that process inputs simultaneously.",
    },
    {
        element: "#playgroundDragNdrop",
        title: "Layers in a Neural Network",
        intro: "Task 3: Add a hidden layer with 3 neurons to your network. Connect this layer to the input node.",
    },
    {
        element: "#playgroundCanvas",
        title: "Layers in a Neural Network",
        intro: "Layers are stacked to form a network. The first layer is the input layer, followed by one or more hidden layers, and the final layer is the output layer.",
    },
    {
        element: "#playgroundCanvas",
        title: "Layers in a Neural Network",
        intro: "Task 4: Add an output layer with 1 neuron. Connect this layer to the hidden layer and connect it to the output.",
    },
    {
        element: "#playgroundCanvas",
        title: "Forward Pass",
        intro: "The forward pass is the process of passing input data through the network to get an output. Each layer transforms the data using its neurons.",
    },
    {
        element: "#hyperparamsBar",
        title: "Forward Pass",
        intro: "Choose a dataset from the available options. Set the number of epochs to 250, learning rate to 0.01, and batch size to 16.",
    },
    {
        element: "#trainBtn",
        title: "Forward Pass",
        intro: "Task 5: Press the train button to train the network.",
    },
    {
        element: "#playgroundCanvas",
        title: "Forward Pass",
        intro: "Then, enter an input value in the canvas.",
    },
    {
        element: "#forwardBtn",
        title: "Forward Pass",
        intro: "And finally, Press the forward pass button to see what output the trained model will produce for this input.",
    },
    {
        element: "#playgroundCanvas",
        title: "Forward Pass",
        intro: "During training, the network adjusts its weights to minimize the error between the predicted and actual outputs. This error is measured by a loss function.",
    },
    {
        element: "#lossesBar",
        title: "Loss Functions",
        intro: "A loss function measures how well the network's predictions match the actual data. Common loss functions include Mean Squared Error (MSE) and Cross-Entropy Loss.",
    },
    {
        element: "#lossesBar",
        title: "Loss Functions",
        intro: "Task 6: Observe the final loss value displayed after training. This value indicates how well the network has learned from the data. A lower loss indicates that the outputs the model predict were close to the values we want it to predict.",
    },
    {
        element: "#lossesBar",
        title: "Loss Functios",
        intro: "However, too low of a loss can indicate overfitting of the dataset used, which means that the model functions very well for the inputs it sees during training, but won't generalize well for other inputs it hasn't seen before.",
    },
    {
        element: "#playgroundCanvas",
        title: "Backpropagation",
        intro: "Backpropagation is the process of updating the network's weights based on the error calculated by the loss function. It uses the chain rule from calculus to calculate the gradient of the loss with respect to each weight.",
    },
    {
        element: "#playgroundCanvas",
        title: "Backpropagation",
        intro: "In this simplified lesson, we won't visualize the backpropagation steps, but remember that it's crucial for training the network to improve its predictions.",
    },
    {
        element: "#hyperparamsBar",
        title: "Training and Hyperparameters",
        intro: "Hyperparameters like learning rate, epochs, and batch size affect how the network learns. The learning rate controls how much to change the weights during training. Epochs determine how many times the training process runs through the entire dataset. Batch size specifies the number of samples processed before updating the model.",
    },
    {
        element: "#hyperparamsBar",
        title: "Training and Hyperparameters",
        intro: "Task 7: Experiment with different values for the learning rate, epochs, and batch size. Train the network again and observe how the final loss changes.",
    },
    {
        element: "#playgroundCanvas",
        title: "Training and Hyperparameters",
        intro: "once the training is complete you can forward your own inputs through the trained network and visualize the outputs.",
    },
    {
        element: "#playgroundCanvas",
        title: "Training and Hyperparameters",
        intro: "Input any values you like and see how the network responds. This helps you understand how well the network has learned to map inputs to outputs.",
    },
    {
        element: "#helpBtn",
        title: "Conclusion",
        intro: "Congratulations! You've built, trained, and tested your first neural network. You've learned about neurons, layers, forward pass, loss functions, backpropagation, and hyperparameters. This is just the beginning of your journey into AI. Keep exploring and experimenting!",
    },
];


export default steps;